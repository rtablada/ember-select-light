import hbs from 'htmlbars-inline-precompile';
import { render, fillIn, triggerEvent } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

module('Integration | Component | select-light', function(hooks) {
	setupRenderingTest(hooks);

	test('should be a <select> element', async function(assert) {
		await render(hbs`<SelectLight />`);

    assert.dom('select').exists();
	});

	test('should allow classes, ids and names to be added to <select>', async function(assert) {
		await render(hbs`
      <SelectLight
        name="snail"
        id="slug"
        class="form-item" />
    `);

    assert.dom('select').hasClass('form-item');
		assert.dom('select').hasAttribute('name', 'snail');
		assert.dom('select').hasAttribute('id', 'slug');
	});

	test('should be able to toggle disabled status', async function(assert) {
		this.set('disabled', false);

		await render(hbs`<SelectLight disabled={{this.disabled}} />`);

    assert.dom('select').doesNotHaveAttribute('disabled');

		this.set('disabled', true);
    assert.dom('select').hasAttribute('disabled');
	});

	test('should support tabindex', async function(assert) {
		this.set('tabindex', null);

		await render(hbs`<SelectLight tabindex={{this.tabindex}} />`);

		assert.dom('select').doesNotHaveAttribute('tabindex', '0');

		this.set('tabindex', 0);
		assert.dom('select').hasAttribute('tabindex', '0');
	});

	test('should have no options if none are specified', async function(assert) {
		await render(hbs`<SelectLight />`);

    assert.dom('select option').doesNotExist();
	});

	test('should have a (disabled) placeholder option if specified', async function(assert) {
		await render(hbs`<SelectLight @placeholder="Walrus" />`);

    assert.dom('select option').includesText('Walrus');
		assert.dom('option').hasAttribute('disabled');
	});

	test('should be able to yield to passed options', async function(assert) {
		await render(hbs`
		<SelectLight>
			<option value="plat">Platypus</option>
		</SelectLight>
	`);

		assert.dom('select option').includesText('Platypus');
		assert.dom('select option').hasValue('plat');
	});

  test('should be able to yield to passed options with option component', async function(assert) {
		await render(hbs`
		<SelectLight as |sl|>
			<sl.option value="plat">Platypus</sl.option>
		</SelectLight>
	`);

		assert.dom('select option').includesText('Platypus');
		assert.dom('select option').hasValue('plat');
	});

	test('should render options from passed flat array', async function(assert) {
		let options = ['squid', 'octopus'];
		this.setProperties({options});

		await render(hbs`<SelectLight @options={{this.options}} />`);

    assert.dom('select option').exists({ count: options.length });
	});

	test('should select option that matches value', async function(assert) {
		let options = ['squid', 'octopus'];
		let value = options[1];
		this.setProperties({
			options,
			value,
		});

		await render(hbs`
      <SelectLight
        @options={{this.options}}
        @value={{this.value}} />
    `);

		assert.dom('select').hasValue(value);
	});

	test('should change select value when changing data down value', async function(assert) {
		let options = ['shortfin', 'mako'];
		let value = options[1];
		this.setProperties({
			options,
			value,
		});

		await render(hbs`
      <SelectLight
        @options={{this.options}}
        @value={{this.value}}
        @placeholder="hammerhead" />
    `);

		this.set('value', options[0]);
		assert.dom('select').hasValue(options[0]);
	});

	test('should render options correctly when passed array of objects', async function(assert) {
		let options = [
			{ value: 'shortfin', label: 'Shortfin Shark' },
			{ value: 'mako', label: 'Mako Shark' },
		];
		let value = options[1].value;
		this.setProperties({
			options,
			value,
		});

		await render(hbs`
      <SelectLight
        @options={{this.options}}
        @value={{this.value}} />`);

    assert.dom('select option').exists({ count: options.length });
		assert.dom('select option').hasAttribute('value', options[0].value);
		assert.dom('select option').includesText(options[0].label);
		assert.dom('select').hasValue(value);
	});

	test('should render options with customized value and display keys when passed array of objects', async function(assert) {
		let options = [
			{ val: 'shortfin', description: 'Shortfin Shark' },
			{ val: 'mako', description: 'Mako Shark' },
		];
		let value = options[1].value;
		this.setProperties({
			options,
			value,
		});

		await render(hbs`
      <SelectLight
        @options={{this.options}}
        @value={{this.value}}
        @valueKey="val"
        @displayKey="description" />
    `);

		assert.dom('select option').hasAttribute('value', options[0].val);
		assert.dom('select option').includesText(options[0].description);
	});

	test('should render options correctly when value is an empty string', async function(assert) {
		let options = [
			{ value: '', label: 'None' },
			{ value: 'mako', label: 'Mako Shark' },
		];
		let value = options[1].value;
		this.setProperties({
			options,
			value,
		});

		await render(hbs`
      <SelectLight
        @options={{this.options}}
				@value={{this.value}} />`);

    assert.dom('select option').exists({ count: options.length });
		assert.dom('select option').hasAttribute('value', options[0].value);
		assert.dom('select option').includesText(options[0].label);
		assert.dom('select').hasValue(value);
	});

	test('should fire onChange despite the deprecation warning if using @change', async function(assert) {
		this.set('myValue', null);

		await render(hbs`
      <SelectLight @change={{action (mut myValue)}}>
        <option value="turtle">Turtle</option>
      </SelectLight>
    `);

		await fillIn('select', 'turtle');
		await triggerEvent('select', 'change');

		assert.dom('select').hasValue('turtle');
		assert.equal(this.myValue, 'turtle');
	});

	test('should fire onChange when user chooses option, mut with yield and native option', async function(assert) {
		this.set('myValue', null);

		await render(hbs`
      <SelectLight @onChange={{action (mut myValue)}}>
        <option value="turtle">Turtle</option>
      </SelectLight>
    `);

		await fillIn('select', 'turtle');
		await triggerEvent('select', 'change');

		assert.dom('select').hasValue('turtle');
		assert.equal(this.myValue, 'turtle');
	});

	test('should fire onChange when user chooses option, mut with yielded option component', async function(assert) {
		this.set('myValue', null);

		await render(hbs`
      <SelectLight @onChange={{action (mut myValue)}} as |sl|>
        <sl.option value="turtle">Turtle</sl.option>
      </SelectLight>
    `);

		await fillIn('select', 'turtle');
		await triggerEvent('select', 'change');

		assert.dom('select').hasValue('turtle');
		assert.equal(this.myValue, 'turtle');
	});

	test('should fire onChange when user chooses option, mut with flat array', async function(assert) {
		let options = ['clam', 'starfish'];
		this.setProperties({
			options,
			myValue: options[1],
			value: options[1],
		});

		await render(hbs`
      <SelectLight
        @options={{this.options}}
        @value={{this.value}}
        @onChange={{action (mut this.myValue)}} />
    `);

		await fillIn('select', options[0]);
		await triggerEvent('select', 'change');

		assert.dom('select').hasValue(options[0]);
		assert.equal(this.myValue, options[0]);
	});

	test('should fire onChange when user chooses option, custom action with flat array', async function(assert) {
		let options = ['clam', 'starfish'];
		this.setProperties({
			options,
			value: options[1],
			customAction: (value) => {
        assert.step('handled action');
				assert.equal(value, options[0]);
			},
		});

		await render(hbs`
      <SelectLight
        @options={{this.options}}
        @value={{this.value}}
        @onChange={{action this.customAction}} />
    `);
		await fillIn('select', options[0]);

    assert.verifySteps(['handled action']);
	});
});
