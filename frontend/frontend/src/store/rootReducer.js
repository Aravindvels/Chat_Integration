import { baseService } from "../service/loginservice";
import { chatService  } from "../service/chatService";
import applicationSlice from "../slice/applicationSlice";


const rootReducer = {
  application: applicationSlice,
  [baseService.reducerPath]: baseService.reducer,
  [chatService.reducerPath]: chatService.reducer,
};

export default rootReducer;
