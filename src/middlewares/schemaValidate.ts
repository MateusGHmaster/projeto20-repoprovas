import { Request, Response, NextFunction } from 'express';

export default function schemaValidate (schema: any) {

    return (req: Request, res: Response, next: NextFunction) => {

        const validation = schema.validate(req.body);

        if(validation.error) {
            throw {
                type: 'bad_request',
                message: validation.error.details
            };
        }

        next();

    };

}