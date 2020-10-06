expect.extend({
    toMatchExpectations(mockCalls, verbExpectations) {
        // const remainingExpectations = verbExpectations.slice(0)
        // const remainingMockCalls = mockCalls.slice(0)
    
        const isLonger = mockCalls.length !== verbExpectations.length

        if(isLonger) return {
            message: () => (`expected calls ${this.utils.printReceived(mockCalls)} to be same length as expectation ${this.utils.printExpected(verbExpectations)}`),
            pass: false
        }

        let isSame: boolean = true
        for(let i = 0; i < mockCalls.length; i++) {
            expect(mockCalls[i][0]).toEqual(verbExpectations[i])

            // if(verbExpectations[i].match) {
            //     expect(mockCalls[i][0]).toMatchObject(verbExpectations[i].match)
            // }
            // if(verbExpectations[i].equal) {
            //     expect(mockCalls[i][0]).toEqual(verbExpectations[i].equal)
            // }
        }

        // const pass = true
      
  
        // if (pass) {
        //     return {
        //         message: () => (`expected ${this.utils.printReceived(received)} not to contain object ${this.utils.printExpected(argument)}`),
        //         pass: true
        //     }
        // } else {
        //     return {
        //         message: () => (`expected ${this.utils.printReceived(received)} to contain object ${this.utils.printExpected(argument)}`),
        //         pass: false
        //     }
        // }
    }
  })

jest.useFakeTimers();

export function testProducer(name: string, {
    producer, 
    presets = {}, 
    expectations = {}
}) {
    test(name, () => {
        const args = producer.args.value
        // console.log(args)
        const keys = Object.keys(args)
        const mockMap = {}
        keys.forEach(key => {         
            switch(args[key].type) {
                case "OBSERVE":
                    if(presets[key]) {
                        mockMap[key] = presets[key]
                    }
                    break
                case "VALUE":
                    if(presets[key]) {
                        mockMap[key] = presets[key]
                    } else {
                        mockMap[key] = args[key].value.value
                    }
                    break
                case "GET":
                    const m = jest.fn()
                    if(presets[key]) {
                        m.mockReturnValue(presets[key])
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
        })
    
        producer.fn(mockMap)
        jest.runAllTimers()
    
        keys.forEach(key => {
            switch(args[key].type) {
                case "UPDATE":
                    Object.keys(expectations[key])
                    .forEach(verb => {
                        expect(mockMap[key][verb].mock.calls).toMatchExpectations(expectations[key][verb])
                    })
                    break;
                default:
                    break;
            }
        })
    })
}