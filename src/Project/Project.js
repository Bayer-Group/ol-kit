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
    // download the project file to local machine
    const dataString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(projectFile))}`
    const downloadAnchorElement = document.getElementById('_ol_kit_project_download_anchor')

    downloadAnchorElement.setAttribute('href', dataString)
    downloadAnchorElement.setAttribute('download', 'ol_kit_project.json')
    downloadAnchorElement.click()
  }

  render () {
    return (
      <ProjectMenuContainer>
        <a id='_ol_kit_project_download_anchor' style={{ display: 'none' }}></a>
        <button id='_ol_kit_create_project' onClick={this.onCreateProject}>Create a project</button>
      </ProjectMenuContainer>
    )
  }
}

ProjectMenu.propTypes = {
  /** a reference to openlayers map object */
  map: PropTypes.object.isRequired
}

export default connectToContext(ProjectMenu)
