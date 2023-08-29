abstract class InputValidator {
    private failureMessage: string = ""
    private fieldName: string = ""
    private inputValue: string

    constructor(inputValue: string, fieldName?: string) {
        this.inputValue = inputValue;
        this.fieldName = fieldName || "";
    }

    public getInputValue() { return this.inputValue; }
    public setInputValue(inputValue: string) { this.inputValue = inputValue; }
    public getFailureMessage() { return this.failureMessage; }
    public setFailureMessage(failureMessage: string) { this.failureMessage = failureMessage; }
    public getFieldName() { return this.fieldName; }
    public setFieldName(fieldName: string) { this.fieldName = fieldName; }

    abstract validate(): boolean
}

class UniqueInputValidator extends InputValidator {

    private tableName: string
    private columnName: string
    private ignoreId?: number;


    constructor(
        inputValue: string, fieldName: string, 
        tableName: string, columnName: string, ignoreId?: number
    ) {
        super(inputValue, fieldName);
        this.tableName = tableName;
        this.columnName = columnName;
        this.ignoreId = ignoreId || -1;
    }

    public validate() {
        return false
    }
}

class RequiredInputValidator extends InputValidator {



    public validate() {
        if (this.getInputValue().trim().length == 0) {
            this.setFailureMessage(`${this.getFieldName()} is required.`)
            return false;
        }
        else {
            return true;
        }
    }
}