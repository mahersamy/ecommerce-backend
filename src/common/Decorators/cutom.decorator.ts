import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const AuthUser = createParamDecorator(
    (data, ctx:ExecutionContext) => {
        return {name:"hassan",age:20};
    }
)