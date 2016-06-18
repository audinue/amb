
# Models

```
- Window
  - left       : Number
  - top        : Number
  - width      : Number
  - height     : Number
  - isMinimized: Boolean
  - isMaximized: Boolean
  - zIndex     : Number
- Page
  - _id        : String
  - name       : String
  - title      : String
  - html       : String
  - css        : String
  - js         : String
  - htmlWindow : Window
  - cssWindow  : Window
  - jsWindow   : Window
- App
  - pages      : Array<Page>
  - currentPage: Page
- AppSettings
  - lastId     : String
```
