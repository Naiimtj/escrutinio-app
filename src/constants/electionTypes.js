export const ELECTION_TYPES = [
  {
    value: 'convencion_area',
    translationKey: 'step2.form.electionTypes.areaConvention',
  },
  {
    value: 'convencion_nacional',
    translationKey: 'step2.form.electionTypes.nationalConvention',
  },
  {
    value: 'eleccion_ael',
    translationKey: 'step2.form.electionTypes.localSpiritualAssembly',
  },
  {
    value: 'coordinator',
    translationKey: 'step2.form.electionTypes.coordinator',
  },
  {
    value: 'secretary',
    translationKey: 'step2.form.electionTypes.secretary',
  },
  {
    value: 'otros',
    translationKey: 'step2.form.electionTypes.other',
  },
];

export const getElectionTypeTranslationKey = (value) => {
  const electionType = ELECTION_TYPES.find((type) => type.value === value);
  return electionType ? electionType.translationKey : null;
};

export const getElectionTypeLabel = (value, t) => {
  const translationKey = getElectionTypeTranslationKey(value);
  return translationKey ? t(translationKey) : value;
};
