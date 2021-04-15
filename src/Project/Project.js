import React from 'react'
import PropTypes from 'prop-types'
import { connectToContext } from 'Provider'
import { MiniContainer, MiniHeader, ProjectMenuContainer } from './styled'
import { createProject, loadProject } from './utils'

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
    const dataString = `data:text/jsoncharset=utf-8,${encodeURIComponent(JSON.stringify(projectFile))}`
    const downloadAnchorElement = document.getElementById('_ol_kit_project_download_anchor')

    downloadAnchorElement.setAttribute('href', dataString)
    downloadAnchorElement.setAttribute('download', 'ol_kit_project.olkproj')
    downloadAnchorElement.click()
  }

  onLoadProject = async () => {
    const { map } = this.props
    const upload = document.getElementById('myFile')
    const reader = new FileReader()

    reader.addEventListener('load', e => {
      const data = e.target.result
      const project = JSON.parse(data)

      loadProject(map, project)
    })
    reader.readAsBinaryString(upload.files[0])
  }

  render () {
    return (
      <ProjectMenuContainer>
        <a id='_ol_kit_project_download_anchor' style={{ display: 'none' }}></a>
        <MiniContainer>
          <MiniHeader>Save this map as an ol-kit project file:</MiniHeader>
          <button id='_ol_kit_create_project' onClick={this.onCreateProject}>Save Project</button>
        </MiniContainer>
        <MiniContainer>
          <MiniHeader>Load a map from a project file:</MiniHeader>
          <input type='file' id='myFile' accept='.olkproj' onChange={this.onLoadProject} />
        </MiniContainer>
      </ProjectMenuContainer>
    )
  }
}

ProjectMenu.propTypes = {
  /** a reference to openlayers map object */
  map: PropTypes.object.isRequired
}

export default connectToContext(ProjectMenu)
