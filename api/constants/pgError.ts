class PgErrorConstant {
  static get code() {
    return {
      UNIQUE_VIOLATION: '23505',
    };
  }
}

export default PgErrorConstant;