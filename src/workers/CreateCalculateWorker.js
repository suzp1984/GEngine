import createTaskProcessorWorker from './CreateTaskProcessorWorker'
function CreateCalculateWorker(parameters, transferableObjects){
    const value=parameters.data?parameters.data:10;
    let nums=0;
    for (let i= 0; i< value; i++) {
        nums+=i;       
    }
   return nums;
}
export default createTaskProcessorWorker(CreateCalculateWorker);