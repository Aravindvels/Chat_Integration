import { baseService } from "../service/loginservice";
import { chatService  } from "../service/chatService";

const middleware = [baseService.middleware, chatService.middleware];

export default middleware;
