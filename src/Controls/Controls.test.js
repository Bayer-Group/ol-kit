import { mount } from 'enzyme'
import olMap from 'ol/map'
import Controls from './Controls'

describe('<Controls />', () => {
  it('should mount', () => {
    const mockMap = new olMap()
    const wrapper = mount(<Controls map={mockMap} />)

    console.log(wrapper)
  })
})
