import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): object;
    getHealth(): {
        status: string;
        timestamp: string;
        service: string;
        version: string;
    };
    getProtected(): {
        message: string;
        timestamp: string;
    };
    getAdminOnly(): {
        message: string;
        timestamp: string;
    };
}
