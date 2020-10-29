import { mockArgs } from './mockArgs'
import { validateResults } from './validateResults'

export const testProducerCallback = (producer, values, expectations) => {
    return () => {
        jest.useFakeTimers();

        const mockMap = mockArgs(producer, values);
        validateResults(producer, mockMap, expectations)
    
        jest.useRealTimers()
    }
}

