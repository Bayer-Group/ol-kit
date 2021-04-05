import React from 'react'
import PropTypes from 'prop-types'
import { connectToContext } from 'Provider'
import { ProjectMenuContainer } from './styled'
import { createProject } from './utils'

/** A project save/load component
 * @component
 * @category Project
 * @since 1.9.0
 */
class ProjectMenu extends React.Component {
  onCreateProject = async () => {
    const { map } = this.props
    const projectFile = await createProject(map)

    console.log(projectFile)
  }

  render () {
    return (
      <ProjectMenuContainer>
        <button onClick={this.onCreateProject}>Create a project</button>
      </ProjectMenuContainer>
    )
  }
}

export default connectToContext(ProjectMenu)
