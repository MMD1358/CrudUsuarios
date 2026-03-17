import { FormControl } from '@angular/forms';

export interface UserFormGroup {
  email: FormControl<string | null>;
  name: FormControl<string | null>;
}
