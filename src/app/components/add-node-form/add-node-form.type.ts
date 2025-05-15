import { FormControl } from '@angular/forms';

import { MachineStatus } from '../../types/machine.type';

export interface AddNodeFormGroup {
  id: FormControl<string>;
  owner: FormControl<string>;
  status: FormControl<MachineStatus>;
  version: FormControl<string>;
  target: FormControl<string | null>;
}
