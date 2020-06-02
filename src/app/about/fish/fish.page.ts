import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fish',
  templateUrl: './fish.page.html',
  styleUrls: ['./fish.page.scss'],
})
export class FishPage implements OnInit {
  earlyYearsText: string;
  youngStudText: string = '';
  epicMigrationText: string;

  constructor() { }

  ngOnInit() {
    this.earlyYearsText = 'Salmon hatch from eggs at the bottom of a stream or lake. They spend years 0-4 in freshwater eating insects and crustaceans, and avoid predators like birds and larger fish.';
    this.youngStudText = 'After 4 years or so, the salmon swim downstream to the deep blue sea. Their scales change to a shiny silver color, teeth grow in, and the Salmon grow in length. For the next 1-7 years they start eating plankton, squid, and other fish and bulk up a ton.';
    this.epicMigrationText = 'Now the Salmon has found its calling. These big, strong Salmon begin the journey upstream, all the way back to their birthplace in freshwater. They stop at nothing to make it home. Not only swimming against the current, but literally flinging themselves through waterfalls! Most Salmon do not eat anything during this journey, and it shows - the ones that make it all the way home look near-dead. The Females dig little depressions in the lake (redds) and lay eggs, to which the Males proceed to fertilize before both fish parents die shortly after.';
  }

}
