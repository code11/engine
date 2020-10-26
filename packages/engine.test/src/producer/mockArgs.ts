import { ProducerConfig } from "@c11/engine.types"

export const mockArgs = (producer, values: object) => {
    const args = producer.args.value
    const keys = Object.keys(args)
    

    return keys.reduce((mockMap: object, key: string) => {
        switch(args[key].type) {
            case "OBSERVE":
                if(values[key]) {
                    mockMap[key] = values[key]
                }
                break
            case "VALUE":
                if(values[key]) {
                    mockMap[key] = values[key]
                } else {
                    mockMap[key] = args[key].value.value
                }
                break
            case "GET":
                const m = jest.fn()
                if(values[key]) {
                    m.mockReturnValue(values[key])
                }
                
                mockMap[key] = m
                break;
            case "UPDATE":
                mockMap[key] = {
                    set: jest.fn(),
                    remove: jest.fn(),
                    merge: jest.fn()
                }
                break;
            default:
                break;
        }

        return mockMap;
    }, {})
}