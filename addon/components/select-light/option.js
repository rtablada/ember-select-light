import Component from '@glimmer/component';


export default class SelectLightOption extends Component {
  constructor() {
    super(...arguments);

    this.valueKey = this.args.valueKey ?? 'value';
    this.displayKey = this.args.displayKey ?? 'label';
  }

  get value() {
    return this.args.value?.[this.valueKey] ?? this.args.value;
  }

  get label() {
    return this.args.value?.[this.displayKey];
  }

  get selected() {
    return this.args.selectedValue === this.args.value || this.args.selectedValue === this.value;
  }
}
