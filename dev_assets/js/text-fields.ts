export class TextFields {
  constructor() {}

  static onFocus(parent) {
    parent.classList.add('active')
    if (!parent.classList.contains('filled')) {
      parent.classList.add('filled')
    }
  }

  static onBlur(field, parent) {
    if (field.value === '') {
      parent.classList.remove('filled')
    }
    parent.classList.remove('active')
  }

  static addEvents() {
    ;['focus', 'blur'].forEach((item) => {
      document.addEventListener(
        item,
        (e) => {
          const { type: eventType, target: field } = e
          const { parentNode: parent } = field as Element

          if (
            (field as HTMLElement).tagName === 'INPUT' ||
            (field as HTMLElement).tagName === 'TEXTAREA'
          ) {
            switch (eventType) {
              case 'focus':
                TextFields.onFocus(parent)
                break
              case 'blur':
                TextFields.onBlur(field, parent)
                break
            }
          }
        },
        true
      )
    })
  }

  static init() {
    document.addEventListener('DOMContentLoaded', () => {
      const fields = document.querySelectorAll('input, textarea')

      fields.forEach((field) => {
        const { parentNode: parent } = field
        if ((field as HTMLInputElement).value !== '') {
          ;(parent as HTMLElement).classList.add('filled')
        }
      })

      TextFields.addEvents()
    })
  }
}

TextFields.init()
