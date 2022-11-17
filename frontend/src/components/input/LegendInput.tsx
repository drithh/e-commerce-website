import { FC, FormEvent } from 'react';

type Props = {
  type?: string;
  name: string;
  placeholder?: string;
  extraClass?: string;
  required?: boolean;
  border?: string;
  id?: string;
  label?: string;
  onChange?: (e: FormEvent<HTMLInputElement>) => void;
  value?: string | number;
  readOnly?: boolean;
};

const LegendInput: FC<Props> = ({
  type = 'text',
  name,
  placeholder,
  extraClass,
  required = false,
  border = '',
  label = '',
  onChange,
  value,
  readOnly = false,
}) => (
  <fieldset
    className={`${
      !readOnly ? 'focus-within:border-gray-700' : ''
    } w-full border border-gray-300 pb-2 `}
  >
    <legend className="ml-2 pr-2 pl-1 font-semibold">{label}</legend>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      onChange={onChange}
      value={value}
      aria-label={label}
      className={`w-full  pl-6 ${extraClass}`}
      readOnly={readOnly}
    />
  </fieldset>
);

export default LegendInput;
