import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  saveToLocalStorage,
  getFromLocalStorage,
  STORAGE_KEYS,
} from '../utils/localStorage';
import { inputStyles } from '../utils/styles';
import { BaseButton } from './base';

// Form field component
const FormField = ({
  label,
  register,
  errors,
  name,
  type = 'text',
  rows,
  placeholder,
  validation,
  showRequired = true,
}) => {
  const InputComponent = type === 'textarea' ? 'textarea' : 'input';
  const inputProps = {
    ...register(name, validation),
    className: inputStyles,
    ...(type === 'textarea' && { rows }),
    ...(type !== 'textarea' && { type }),
    ...(placeholder && { placeholder }),
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label} {showRequired && '*'}
        </label>
      )}
      <InputComponent
        {...inputProps}
        className={`${inputStyles} dark:bg-gray-50`}
      />
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
      )}
    </div>
  );
};

const Step2 = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const delegates = watch('delegates', 0);
  const scrutineers = watch('scrutineers', 0);

  useEffect(() => {
    const savedConfig = getFromLocalStorage(STORAGE_KEYS.CONFIGURATION);
    if (savedConfig) {
      // Cargar valores básicos
      setValue('delegates', savedConfig.delegates);
      setValue('votes', savedConfig.votes);
      setValue('scrutineers', savedConfig.scrutineers);

      // Cargar áreas de delegados
      if (
        savedConfig.delegateAreas &&
        Array.isArray(savedConfig.delegateAreas)
      ) {
        savedConfig.delegateAreas.forEach((area, index) => {
          setValue(`delegateArea${index}`, area);
        });
      }

      // Cargar nombres de escrutadores
      if (
        savedConfig.scrutineersNames &&
        Array.isArray(savedConfig.scrutineersNames)
      ) {
        savedConfig.scrutineersNames.forEach((name, index) => {
          setValue(`scrutineerName${index}`, name);
        });
      }
    }
  }, [setValue]);

  const onSubmit = (data) => {
    // Recopilar nombres de áreas para delegados
    const delegateAreas = [];
    for (let i = 0; i < delegates; i++) {
      if (data[`delegateArea${i}`]) {
        delegateAreas.push(data[`delegateArea${i}`]);
      }
    }

    // Recopilar nombres de escrutadores
    const scrutineersNames = [];
    for (let i = 0; i < scrutineers; i++) {
      if (data[`scrutineerName${i}`]) {
        scrutineersNames.push(data[`scrutineerName${i}`]);
      }
    }

    const configuration = {
      delegates: Number.parseInt(data.delegates, 10),
      delegateAreas,
      votes: Number.parseInt(data.votes, 10),
      scrutineers: Number.parseInt(data.scrutineers, 10),
      scrutineersNames,
    };
    saveToLocalStorage(STORAGE_KEYS.CONFIGURATION, configuration);
    onNext();
  };

  const numberValidation = {
    required: t('step2.errors.required'),
    min: { value: 1, message: t('step2.errors.min') },
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        {t('step2.title')}
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-300">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex gap-4 w-full!">
            <FormField
              label={t('step2.form.delegates')}
              register={register}
              errors={errors}
              name="delegates"
              type="number"
              validation={numberValidation}
              className="w-full!"
            />

            {/* Campos dinámicos para áreas de delegados */}
            {delegates > 0 && (
              <div className="space-y-4 w-full!">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {t('step2.form.delegateAreas')}
                </h3>
                {Array.from({ length: delegates }).map((_, index) => (
                  <FormField
                    key={`delegateArea${index}`}
                    register={register}
                    errors={errors}
                    name={`delegateArea${index}`}
                    placeholder={`${t('step2.form.areaName')} ${index + 1}`}
                    validation={{ required: t('step2.errors.required') }}
                    showRequired={false}
                  />
                ))}
              </div>
            )}
          </div>

          <FormField
            label={t('step2.form.votes')}
            register={register}
            errors={errors}
            name="votes"
            type="number"
            validation={numberValidation}
          />
          <div className="flex gap-4 w-full!">
            <FormField
              label={t('step2.form.scrutineers')}
              register={register}
              errors={errors}
              name="scrutineers"
              type="number"
              validation={numberValidation}
            />

            {/* Campos dinámicos para nombres de escrutadores */}
            {scrutineers > 0 && (
              <div className="space-y-4 w-full!">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {t('step2.form.scrutineersNames')}
                </h3>
                {Array.from({ length: scrutineers }).map((_, index) => (
                  <FormField
                    key={`scrutineerName${index}`}
                    register={register}
                    errors={errors}
                    name={`scrutineerName${index}`}
                    placeholder={`${t('step2.form.scrutineerName')} ${index + 1}`}
                    validation={{ required: t('step2.errors.required') }}
                    showRequired={false}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <BaseButton onClick={onBack} size="large" outlined>
              {t('navigation.back')}
            </BaseButton>
            <BaseButton type="submit" variant="primary" size="large">
              {t('navigation.next')}
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step2;
