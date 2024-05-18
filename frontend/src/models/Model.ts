import { validateSync, ValidationError } from "class-validator";
import { memoizeWith } from "ramda";

export default abstract class Model {
  protected constructor(protected validateFields: string[] = []) {}

  get errors() {
    const classValidatorErrors = validateSync(this);

    if (classValidatorErrors.length !== 0) return this.getResultByErrors(classValidatorErrors);

    return this.getValidResult(true);
  }

  private getResultByErrors(classValidatorErrors: ValidationError[]) {
    const errors = classValidatorErrors.map((error) => [
      error.property,
      error.constraints ? Object.values(error.constraints)[0] : "unknown",
    ]);

    return this.getValidResult(
      false,
      Object.fromEntries(errors),
    );
  }

  getValidResult(valid: boolean, visibleCauses: Record<string, string> = {}) {
    const modelKeys = this.getValidatableFieldKeys();
    const allKeysWithEmptyValues = Object.fromEntries(modelKeys.map((key) => [key, undefined]));

    console.log({
      valid,
      causes: Object.assign({}, allKeysWithEmptyValues, visibleCauses),
    })
    return {
      valid,
      causes: Object.assign({}, allKeysWithEmptyValues, visibleCauses),
    };
  }

  private getValidatableFieldKeys = memoizeWith(
    () => "",
    (): string[] => this.validateFields,
  );
}