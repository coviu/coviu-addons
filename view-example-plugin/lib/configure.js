const stylesModule = require('./styles/configure.module.scss');

const CONFIG_SETTING_KEY = '' // Any string

module.exports = (api) => {
  const { h, spinner } = api.render;
  const { value, struct } = api.observ;

  // Construct a state object
  const state = struct({
    loading: value(true),
    saving: value(false),
    status: value('initial'),
    inputText: value(''),
    inputCheckbox1: value(false),
    inputCheckbox2: value(false),
  });

  // Trigger view updates on state updates
  state(api.touch);

  // Load the initial setting state
  api.persist
    .loadPublicSetting(CONFIG_SETTING_KEY)
    .then(config => {
      state.loading.set(false);
      if (!config) return;
      state.inputText.set(config.inputText);
      state.inputCheckbox1.set(config.inputCheckbox1 || false);
      state.inputCheckbox2.set(config.inputCheckbox2 || false);
    })
    .catch(console.error);

  const save = () => {
    state.saving.set(true);
    // Save setting state
    return api.persist
      .savePublicSetting(CONFIG_SETTING_KEY, {
        inputText: state.inputText(),
        inputCheckbox1: state.inputCheckbox1(),
        inputCheckbox2: state.inputCheckbox2()
      })
      .then(() => {
        state.saving.set(false);
        state.status.set('success');
      })
      .catch(err => {
        state.saving.set(false);
        state.status.set('error');
      });
  };

  return function() {
    const _state = state();
    const {
      inputText,
      loading,
      saving,
      status,
      inputCheckbox1,
      inputCheckbox2
    } = _state;
    if (loading || saving) return spinner();
    return h(
      'form.Standard_Form',
      {
        'ev-submit': e => {
          e.preventDefault();
          save();
        }
      },
      [
        h('div.StandardForm_Row', [
          h('label', ['Input text', h('span.Required', 'Required')]),
          h(`input.Input`, {
            value: inputText,
            'ev-input': e => {
              state.inputText.set(e.target.value);
            },
            placeholder: 'eg: text',
            required: true
          }),
          h(
            'div.StandardForm_Note.-info',
            'description'
          )
        ]),
        h(`div.${stylesModule.Checkbox_Row}`, [
          h(`label.${stylesModule.Checkbox_Label}`, [
            h('input', {
              type: 'checkbox',
              checked: inputCheckbox1,
              'ev-change': e => {
                state.inputCheckbox1.set(e.target.checked);
              },
              required: true
            }),
            'checkbox1',
            h(`span.${stylesModule.Required}`, 'Required')
          ])
        ]),
        h(`div.${stylesModule.Checkbox_Row}`, [
          h(`label.${stylesModule.Checkbox_Label}`, [
            h('input', {
              type: 'checkbox',
              checked: inputCheckbox2,
              'ev-change': e => {
                state.inputCheckbox2.set(e.target.checked);
              }
            }),
            'checkbox2'
          ])
        ]),
        h(
          `button.Button.${stylesModule.SubmitButton}`,
          {
            type: 'submit'
          },
          'Save'
        ),
        status === 'success'
          ? h(
              'div.HighlightedText.-success.-block',
              'Your settings have been saved successfully!'
            )
          : undefined,
        status === 'error'
          ? h(
              'div.HighlightedText.-error.-block',
              'Failed to save your settings'
            )
          : undefined
      ]
    );
  };
};
