import { render, screen } from "@testing-library/react";
import App from "./App";

// GIVEN <some current state>
// WHEN <something happens>
//    (... AND <something else happens>)
// THEN <this should be my expected result>

// FEATURE: App launch
// SCENARIO: A user launches the app.
//  GIVEN that the app is not launched
//  WHEN the user launches the app
//  THEN the form should display with all fields empty

it('renders without crashing and has empty inputs.', () => {
  render(<App />);
  const textInputs = screen.getAllByRole('textbox');
  textInputs.forEach( input => {
    expect(input).toHaveValue("");
  });
  const selectInput = screen.getByRole('combobox');
  expect(selectInput).toHaveValue('Select state*');
  const dateInput = screen.getByLabelText('Enter Date*');
  expect(dateInput).toHaveValue('');
  const radioInputs = screen.getAllByRole('radio');
  radioInputs.forEach( input => {
    expect(input).not.toBeChecked();
  });
});