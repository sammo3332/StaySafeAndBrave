import {DemoProvider} from '@/components/demo/demo-provider';
import {DemoEnglish} from '@/components/demo/demo-english';
export const metadata={title:'Your interactive demo journey',robots:{index:false,follow:false}};
export default function Page(){return <DemoProvider><DemoEnglish/></DemoProvider>;}
