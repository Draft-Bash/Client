"use strict";
class InputValidator {
    constructor(inputValue, fieldName) {
        this.failureMessage = "";
        this.fieldName = "";
        this.inputValue = inputValue;
        this.fieldName = fieldName || "";
    }
    getInputValue() { return this.inputValue; }
    setInputValue(inputValue) { this.inputValue = inputValue; }
    getFailureMessage() { return this.failureMessage; }
    setFailureMessage(failureMessage) { this.failureMessage = failureMessage; }
    getFieldName() { return this.fieldName; }
    setFieldName(fieldName) { this.fieldName = fieldName; }
}
class UniqueInputValidator extends InputValidator {
    constructor(inputValue, fieldName, tableName, columnName, ignoreId) {
        super(inputValue, fieldName);
        this.tableName = tableName;
        this.columnName = columnName;
        this.ignoreId = ignoreId || -1;
    }
    validate() {
        return false;
    }
}
class RequiredInputValidator extends InputValidator {
    validate() {
        if (this.getInputValue().trim().length == 0) {
            this.setFailureMessage(`${this.getFieldName()} is required.`);
            return false;
        }
        else {
            return true;
        }
    }
}
