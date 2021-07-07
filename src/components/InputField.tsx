import styles from '../styles/InputField.module.css';
import { ChangeEvent } from 'react';

export default function InputField({
  label,
  id,
  type,
  value,
  onChange,
}: {
  label: string;
  id: string;
  type: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={styles.inputField}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        className={styles.input}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
