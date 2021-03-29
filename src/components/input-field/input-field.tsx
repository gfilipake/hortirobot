import React from "react";
import './input-field.scss';

interface IInputFieldProps {
  value?: string | number;
  title?: string;
  onChange: (value: string) => void;
  withoutMarginTop?: boolean;
  customType?: 'number';
  numberProps?: {
    max?: number;
    min?: number;
  }
  disabled?: boolean;
}

export class InputField extends React.Component<IInputFieldProps, {}> {
  constructor(props: IInputFieldProps) {
    super(props);

    this.state = {};
  }

  render() {
    const { value, title, withoutMarginTop, customType, numberProps, disabled } = this.props;

    return (
      <div className={`input-field-container ${withoutMarginTop && 'without-margin-top'}`}>
        {title && <span>{title}</span>}
        <input
          placeholder="Digite um valor..."
          value={value || typeof value === 'number' ? value : ""}
          type={customType ? customType : 'text'}
          onChange={(event) => this.props.onChange(event.target.value)}
          max={numberProps && numberProps.max ? numberProps.max : undefined}
          min={numberProps && numberProps.min ? numberProps.min : undefined}
          disabled={disabled}
        />
      </div>
    );
  }
}
