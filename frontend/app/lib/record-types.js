export const RECORD_TYPE_TEXT = "TEXT";
export const RECORD_TYPE_BEAN = "BEAN";

export const ACTIVE_RECORD_TYPE_CODES = [RECORD_TYPE_TEXT, RECORD_TYPE_BEAN];

export const RECORD_TYPE_REGISTRY = {
  [RECORD_TYPE_TEXT]: {
    code: RECORD_TYPE_TEXT,
    listLabelMessageKey: "recordTypeTextLabel",
    modalTitleMessageKey: "recordNewTextOptionTitle",
    modalBodyMessageKey: "recordNewTextOptionBody",
  },
  [RECORD_TYPE_BEAN]: {
    code: RECORD_TYPE_BEAN,
    listLabelMessageKey: "recordTypeBeanLabel",
    modalTitleMessageKey: "recordNewBeanOptionTitle",
    modalBodyMessageKey: "recordNewBeanOptionBody",
  },
};

function createEmptyBeanFields() {
  return {
    beanName: "",
    originCountry: "",
    originRegion: "",
    beanVariety: "",
    processType: "",
    roastLevel: "",
    roastDate: "",
    altitudeMeters: "",
    tastingNotes: "",
    purchaseDate: "",
    purchasePrice: "",
    quantityGrams: "",
    memo: "",
    attachmentPlaceholder: [],
  };
}

export function createDraftRecord(recordType, index) {
  const timestamp = Date.now();
  const baseRecord = {
    id: `draft-${recordType.toLowerCase()}-${timestamp}-${index}`,
    persistedId: null,
    localPersisted: false,
    recordType,
    displayOrder: index - 1,
  };

  if (recordType === RECORD_TYPE_BEAN) {
    return {
      ...baseRecord,
      ...createEmptyBeanFields(),
    };
  }

  return {
    ...baseRecord,
    title: "",
    noteText: "",
  };
}

export function getRecordTypeConfig(recordType) {
  return RECORD_TYPE_REGISTRY[recordType] ?? RECORD_TYPE_REGISTRY[RECORD_TYPE_TEXT];
}
