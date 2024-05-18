import { validateSync, ValidationError } from "class-validator";
import { memoizeWith } from "ramda";
import { Exclude } from "class-transformer";

export default abstract class Model {
  @Exclude()
  protected validateFields: string[] = [];

  protected constructor() {}

  get isValid() {
    const classValidatorErrors = validateSync(this);
    return classValidatorErrors.length === 0;
  }

  get errors() {
    const classValidatorErrors = validateSync(this);

    if (classValidatorErrors.length !== 0)
      return this.getResultByErrors(classValidatorErrors);

    return this.getValidResult(true);
  }

  private getResultByErrors(classValidatorErrors: ValidationError[]) {
    const errors = classValidatorErrors.map((error) => [
      error.property,
      error.constraints ? Object.values(error.constraints)[0] : "unknown",
    ]);

    return this.getValidResult(false, Object.fromEntries(errors));
  }

  getValidResult(valid: boolean, visibleCauses: Record<string, string> = {}) {
    const modelKeys = this.getValidatableFieldKeys();
    const allKeysWithEmptyValues = Object.fromEntries(
      modelKeys.map((key) => [key, undefined])
    );

    return {
      valid,
      causes: Object.assign({}, allKeysWithEmptyValues, visibleCauses),
    };
  }

  private getValidatableFieldKeys = memoizeWith(
    () => "",
    (): string[] => this.validateFields
  );
}
