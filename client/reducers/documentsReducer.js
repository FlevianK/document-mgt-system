export default function documentsReducer(state = [], action) {
  switch(action.type) {
    case "CREATE_DOCUMENT":
    return [...state,
    Object.assign({}, action.document)
    ];

    default:
    return state;
  }
}