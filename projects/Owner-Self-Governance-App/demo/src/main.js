import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Vant组件库
import { 
  Button, 
  Cell, 
  CellGroup, 
  NavBar, 
  Tabbar, 
  TabbarItem,
  Field,
  Form,
  RadioGroup,
  Radio,
  Checkbox,
  CheckboxGroup,
  Popup,
  Picker,
  ActionSheet,
  Dialog,
  Toast,
  Loading,
  List,
  PullRefresh,
  Card,
  Tag,
  Icon,
  Search,
  Tab,
  Tabs,
  Progress,
  Stepper,
  Uploader,
  Grid,
  GridItem,
  Collapse,
  CollapseItem,
  Divider,
  Empty,
  Swipe,
  SwipeItem,
  NoticeBar,
  Sticky,
  Steps,
  Step,
  IndexBar,
  IndexAnchor
} from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)

// 注册Vant组件
app.use(Button)
app.use(Cell)
app.use(CellGroup)
app.use(NavBar)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Field)
app.use(Form)
app.use(RadioGroup)
app.use(Radio)
app.use(Checkbox)
app.use(CheckboxGroup)
app.use(Popup)
app.use(Picker)
app.use(ActionSheet)
app.use(Dialog)
app.use(Toast)
app.use(Loading)
app.use(List)
app.use(PullRefresh)
app.use(Card)
app.use(Tag)
app.use(Icon)
app.use(Search)
app.use(Tab)
app.use(Tabs)
app.use(Progress)
app.use(Stepper)
app.use(Uploader)
app.use(Grid)
app.use(GridItem)
app.use(Collapse)
app.use(CollapseItem)
app.use(Divider)
app.use(Empty)
app.use(Swipe)
app.use(SwipeItem)
app.use(NoticeBar)
app.use(Sticky)
app.use(Steps)
app.use(Step)
app.use(IndexBar)
app.use(IndexAnchor)

app.use(createPinia())
app.use(router)

app.mount('#app')
