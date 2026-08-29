export class ElementaryPosApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ElementaryPosApiError";
  }
}

export class ElementaryPosConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ElementaryPosConfigError";
  }
}
