import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  saveConfiguration,
  getConfiguration,
  deleteConfiguration,
  getAllVoters,
  createVoter,
  getVotersCount,
  deleteAllBallots,
  ballotsExist,
} from '../service';
import { inputStyles } from '../utils/styles';
import { BaseButton, BaseIcon, BaseModal } from './base';
import { DeleteConfirmationModal } from './modals';
import { ELECTION_TYPES } from '../constants/electionTypes';

const FormField = ({
  label,
  register,
  errors,
  touchedFields,
  name,
  type = 'text',
  rows,
  placeholder,
  validation,
  showRequired = true,
  min,
  max,
  helperText,
  className,
  onClamp,
  warnings,
}) => {
  const InputComponent = type === 'textarea' ? 'textarea' : 'input';
  const { onChange, ...registerProps } = register(name, validation);

  const handleChange = (e) => {
    if (type === 'number' && (min !== undefined || max !== undefined)) {
      let value = e.target.value;
      if (value !== '') {
        const numValue = Number(value);
        if (min !== undefined && numValue < min) {
          e.target.value = min;
          onClamp?.();
        } else if (max !== undefined && numValue > max) {
          e.target.value = max;
          onClamp?.();
        }
      }
    }
    onChange(e);
  };

  const inputProps = {
    ...registerProps,
    onChange: handleChange,
    className: inputStyles,
    ...(type === 'textarea' && { rows }),
    ...(type !== 'textarea' && { type }),
    ...(placeholder && { placeholder }),
    ...(min !== undefined && { min }),
    ...(max !== undefined && { max }),
  };

  return (
    <div className={className}>
      {label && (
        <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label} {showRequired && '*'}
        </div>
      )}
      <InputComponent
        {...inputProps}
        className={`${inputStyles} dark:bg-gray-50`}
      />
      {errors[name] && touchedFields?.[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
      )}
      {warnings && <p className="mt-1 text-sm text-orange-500">{warnings}</p>}
      {!errors[name] && helperText && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

const Step2 = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm({ mode: 'onChange' });

  const [delegatesHint, setDelegatesHint] = useState(null);

  const {
    register: registerModal,
    handleSubmit: handleSubmitModal,
    formState: { errors: errorsModal },
    reset: resetModal,
  } = useForm();

  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [pendingDelegates, setPendingDelegates] = useState(null);
  const [initialDelegates, setInitialDelegates] = useState(null);
  const [totalBelievers, setTotalBelievers] = useState(() => {
    return getVotersCount();
  });
  const scrutineers = watch('scrutineers', 0);
  const ballotsPerson = watch('ballots_person', 0);
  const ballotsPostal = watch('ballots_postal', 0);
  const delegates = watch('delegates', 0);
  const totalBallots = Number(ballotsPerson || 0) + Number(ballotsPostal || 0);
  const totalVotersPossible = totalBallots * Number(delegates || 0);

  useEffect(() => {
    const savedConfig = getConfiguration();
    const today = new Date().toISOString().split('T')[0];

    if (savedConfig) {
      setValue('electoral_area', savedConfig.electoral_area);
      setValue('election_date', savedConfig.election_date || today);
      setValue('election_type', savedConfig.election_type || '');
      setValue('total_ballots', savedConfig.total_ballots);
      setValue('ballots_person', savedConfig.ballots_person);
      setValue('ballots_postal', savedConfig.ballots_postal);
      setValue('delegates', savedConfig.delegates);
      setValue('total_voters_posible', savedConfig.total_voters_posible);
      setValue('scrutineers', savedConfig.scrutineers);
      setInitialDelegates(savedConfig.delegates);
      if (
        savedConfig.scrutineersNames &&
        Array.isArray(savedConfig.scrutineersNames)
      ) {
        savedConfig.scrutineersNames.forEach((name, index) => {
          setValue(`scrutineerName${index}`, name);
        });
      }
    } else {
      setValue('election_date', today);
    }
  }, [setValue]);

  useEffect(() => {
    setValue('total_ballots', totalBallots);
    trigger(['ballots_person', 'ballots_postal']);
  }, [totalBallots, totalBelievers, setValue, trigger]);

  useEffect(() => {
    setValue('total_voters_posible', totalVotersPossible);
  }, [totalVotersPossible, setValue]);

  useEffect(() => {
    trigger('delegates');
  }, [totalBelievers, trigger]);

  const showDelegatesHint = () => {
    setDelegatesHint(
      t('step2.errors.delegatesClamped', { max: Math.min(9, totalBelievers) }),
    );
    setTimeout(() => setDelegatesHint(null), 3500);
  };

  const onSubmit = (data) => {
    const newDelegates = Number.parseInt(data.delegates, 10);

    if (
      initialDelegates !== null &&
      initialDelegates !== newDelegates &&
      ballotsExist()
    ) {
      setPendingDelegates(data);
      setShowConfirmModal(true);
      return;
    }

    saveConfigurationData(data);
  };

  const saveConfigurationData = (data) => {
    const scrutineersNames = [];
    for (let i = 0; i < scrutineers; i++) {
      if (data[`scrutineerName${i}`])
        scrutineersNames.push(data[`scrutineerName${i}`]);
    }
    const configuration = {
      electoral_area: data.electoral_area,
      election_date: data.election_date,
      election_type: data.election_type || '',
      total_ballots: Number.parseInt(data.total_ballots, 10),
      ballots_person: Number.parseInt(data.ballots_person, 10),
      ballots_postal: Number.parseInt(data.ballots_postal, 10),
      delegates: Number.parseInt(data.delegates, 10),
      total_voters_posible: Number.parseInt(data.total_voters_posible, 10),
      scrutineers: Number.parseInt(data.scrutineers, 10),
      scrutineersNames,
    };
    saveConfiguration(configuration);
    onNext();
  };

  const handleReset = () => {
    deleteConfiguration();
    reset();
    setInitialDelegates(null);
    setShowResetModal(false);
  };

  const handleConfirmDelegateChange = () => {
    deleteAllBallots();
    saveConfigurationData(pendingDelegates);
    setShowConfirmModal(false);
    setPendingDelegates(null);
  };

  const onSubmitNewBeliever = (data) => {
    createVoter({
      name: data.nombre,
      lastName1: data.primerApellido,
      lastName2: data.segundoApellido,
      location: data.localidad,
    });

    const updatedVoterList = getAllVoters();
    setTotalBelievers(updatedVoterList.length);

    resetModal();
    setShowModal(false);
  };

  const numberValidation = {
    required: t('step2.errors.required'),
    min: { value: 1, message: t('step2.errors.min') },
    max: { value: 9, message: t('step2.errors.max') },
  };

  const delegatesValidation = {
    required: t('step2.errors.required'),
    min: { value: 1, message: t('step2.errors.min') },
    max: {
      value: Math.min(9, totalBelievers),
      message: t('step2.errors.maxBallots', { max: totalBelievers }),
    },
  };

  const ballotsPersonValidation = {
    required: t('step2.errors.required'),
    min: { value: 1, message: t('step2.errors.min') },
    validate: (value) => {
      const total = Number(value) + Number(ballotsPostal || 0);
      return (
        total <= totalBelievers ||
        t('step2.errors.maxBallots', { max: totalBelievers })
      );
    },
  };

  const ballotsPostalValidation = {
    required: t('step2.errors.required'),
    min: { value: 1, message: t('step2.errors.min') },
    validate: (value) => {
      const total = Number(ballotsPerson || 0) + Number(value);
      return (
        total <= totalBelievers ||
        t('step2.errors.maxBallots', { max: totalBelievers })
      );
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white text-center">
        {t('step2.title')}
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-300">
        <div className="mb-6 p-4 bg-lightPrimary dark:bg-lightPrimary/10 rounded-lg border border-blue-200 dark:border-darkPrimary">
          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4">
            <div className="flex flex-col justify-center items-center text-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {t('step2.believersInfo.title')}
              </h3>
              <p className="text-2xl font-bold text-darkPrimary dark:text-primary">
                {totalBelievers} {t('step2.believersInfo.believers')}
              </p>
            </div>
            <BaseButton
              onClick={() => setShowModal(true)}
              variant="primary"
              size="medium"
            >
              {t('step2.believersInfo.addBeliever')}
            </BaseButton>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col md:grid md:grid-cols-3 gap-4"
        >
          <FormField
            label={t('step2.form.electoralArea')}
            register={register}
            errors={errors}
            touchedFields={touchedFields}
            name="electoral_area"
            validation={{ required: t('step2.errors.required') }}
            className="md:col-span-2"
          />
          <FormField
            label={t('step2.form.electionDate')}
            register={register}
            errors={errors}
            touchedFields={touchedFields}
            name="election_date"
            type="date"
            validation={{ required: t('step2.errors.required') }}
            className="md:col-span-1"
          />

          <FormField
            label={t('step2.form.ballotsPerson')}
            register={register}
            errors={errors}
            touchedFields={touchedFields}
            name="ballots_person"
            type="number"
            validation={ballotsPersonValidation}
            min={1}
          />
          <FormField
            label={t('step2.form.ballots')}
            register={register}
            errors={errors}
            touchedFields={touchedFields}
            name="ballots_postal"
            type="number"
            validation={ballotsPostalValidation}
            min={1}
          />
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('step2.form.totalBallots')}
            </label>
            <div className="px-4 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600">
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {totalBallots}
              </span>
            </div>
            <input type="hidden" {...register('total_ballots')} />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('step2.form.electionType')}
            </label>
            <select
              {...register('election_type')}
              className={`${inputStyles} dark:bg-gray-50`}
            >
              <option value="">{t('step2.form.selectOption')}</option>
              {ELECTION_TYPES.map((electionType) => (
                <option key={electionType.value} value={electionType.value}>
                  {t(electionType.translationKey)}
                </option>
              ))}
            </select>
          </div>

          <FormField
            label={t('step2.form.delegates')}
            register={register}
            errors={errors}
            touchedFields={touchedFields}
            name="delegates"
            type="number"
            validation={delegatesValidation}
            min={1}
            max={Math.min(9, totalBelievers)}
            onClamp={showDelegatesHint}
            warnings={delegatesHint}
          />
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('step2.form.totalVotersPossible')}
            </label>
            <div className="px-4 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600">
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {totalVotersPossible}
              </span>
            </div>
            <input type="hidden" {...register('total_voters_posible')} />
          </div>
          <FormField
            label={t('step2.form.scrutineers')}
            register={register}
            errors={errors}
            touchedFields={touchedFields}
            name="scrutineers"
            type="number"
            validation={numberValidation}
            min={1}
            className="col-start-1"
          />
          {scrutineers > 0 && (
            <div className="w-full! md:col-span-2 ">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                {t('step2.form.scrutineersNames')}
              </h3>
              <div className="flex flex-col gap-2">
                {Array.from({ length: scrutineers }).map((_, index) => (
                  <FormField
                    key={`scrutineerName${index}`}
                    register={register}
                    errors={errors}
                    touchedFields={touchedFields}
                    name={`scrutineerName${index}`}
                    placeholder={`${t('step2.form.scrutineerName')} ${index + 1}`}
                    validation={{ required: t('step2.errors.required') }}
                    showRequired={false}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 col-start-1 col-end-4">
            <BaseButton onClick={onBack} size="large" outlined >
              {t('navigation.back')}
            </BaseButton>
            <BaseIcon
              onClick={() => setShowResetModal(true)}
              icon="restart"
              size="x-large"
              className="cursor-pointer fill-red-500 hover:fill-red-700 dark:fill-red-400 dark:hover:fill-red-200 transition-colors duration-300"
              tooltip={t('step2.resetModal.button')}
            />
            <BaseButton
              type="submit"
              variant="primary"
              size="large"
              disabled={!isValid}
            >
              {t('navigation.next')}
            </BaseButton>
          </div>
        </form>
      </div>

      <BaseModal
        visible={showModal}
        title={t('step2.modal.title')}
        onClose={() => {
          setShowModal(false);
          resetModal();
        }}
      >
        <form
          onSubmit={handleSubmitModal(onSubmitNewBeliever)}
          className="space-y-4 text-black!"
        >
          <FormField
            label={t('step2.modal.nombre')}
            register={registerModal}
            errors={errorsModal}
            name="nombre"
            type="text"
            validation={{ required: t('step2.errors.required') }}
          />

          <FormField
            label={t('step2.modal.primerApellido')}
            register={registerModal}
            errors={errorsModal}
            name="primerApellido"
            type="text"
            validation={{ required: t('step2.errors.required') }}
          />

          <FormField
            label={t('step2.modal.segundoApellido')}
            register={registerModal}
            errors={errorsModal}
            name="segundoApellido"
            type="text"
            validation={{ required: t('step2.errors.required') }}
          />

          <FormField
            label={t('step2.modal.localidad')}
            register={registerModal}
            errors={errorsModal}
            name="localidad"
            type="text"
            validation={{ required: t('step2.errors.required') }}
          />

          <div className="flex justify-end gap-3 pt-4">
            <BaseButton
              onClick={() => {
                setShowModal(false);
                resetModal();
              }}
              outlined
            >
              {t('modals.cancel')}
            </BaseButton>
            <BaseButton type="submit" variant="primary">
              {t('modals.accept')}
            </BaseButton>
          </div>
        </form>
      </BaseModal>

      <DeleteConfirmationModal
        isOpen={showResetModal}
        title={t('step2.resetModal.title')}
        message={t('step2.resetModal.message')}
        warningMessage={t('step2.resetModal.warning')}
        onConfirm={handleReset}
        onCancel={() => setShowResetModal(false)}
        confirmText={t('step2.resetModal.button')}
      />

      <DeleteConfirmationModal
        isOpen={showConfirmModal}
        title={t('step2.confirmModal.title')}
        message={t('step2.confirmModal.message')}
        warningMessage={t('step2.confirmModal.warning')}
        onConfirm={handleConfirmDelegateChange}
        onCancel={() => {
          setShowConfirmModal(false);
          setPendingDelegates(null);
        }}
        confirmText={t('modals.confirm')}
        cancelText={t('modals.cancel')}
      />
    </div>
  );
};

export default Step2;
