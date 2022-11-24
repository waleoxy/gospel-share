import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import * as React from "react";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  type: string;
  textarea?: boolean;
};
const InputField: React.FunctionComponent<InputFieldProps> = ({
  label,
  textarea,
  type,
  size: _,
  ...props
}) => {
  let InputOrTextarea: any = Input;
  if (textarea) {
    InputOrTextarea = Textarea;
  }
  

  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name} color="gray.500">
        {label}
      </FormLabel>
      <InputOrTextarea
        {...field}
        {...props}
        borderColor="gray.200"
        color="white"
        id={field.name}
        placeholder={props.placeholder}
        name={field.name}
        type={type}
        // onChange={field.onChange}
        variant="filled"
      />

      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export default InputField;
