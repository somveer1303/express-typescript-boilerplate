import '@/config.server';
import App from '@/app';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import InsuranceRoute from '@routes/insurance.route';
import PerfiosRoute from '@routes/perfios.route';

const app = new App([new IndexRoute(), new UsersRoute(), new InsuranceRoute(), new PerfiosRoute()]);

app.listen();
