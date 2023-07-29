# Calendar

Are components good? - checked  
Single source of truth? - checked  
Pass down props to Calendar because it's a props pass down by user and then based-on that create a state for app only? - checked  

Work on outside calendar features such as:

- view by mode? - checked
- pre-next-today? - checked
- change-duration? - checked

Work on inside calendar features such as:

- hover into calendar?
- now indicator? - on process

# Rules

- all html, react-components or read-only attributes are written NORMAL
- all app properties or data handling properties are CAPITALIZED
- import order:
  - systems
  - constant/hook/model/util (export \*)
  - lib
  - components (export default)
  - css
