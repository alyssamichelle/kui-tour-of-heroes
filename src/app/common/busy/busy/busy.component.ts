import { BusyService } from './../../busy.service';
import { ChangeDetectionStrategy, Component } from '@angular/core'; 
import { Observable } from 'rxjs';
import { BusyState } from '../../busy-state.interface';
@Component({
  selector: 'app-busy',
  templateUrl: './busy.component.html',
  styleUrls: ['./busy.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusyComponent  {

  busyState$ :Observable<BusyState> = this.busyService.busyState$;
  constructor(private readonly busyService: BusyService) {
   }

}
