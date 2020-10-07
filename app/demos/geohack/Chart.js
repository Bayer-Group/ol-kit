import React from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar,
} from 'recharts'
import {
    Button,
    Modal,
} from 'react-bootstrap'
import { saveAs, } from 'file-saver'
import MUIDataTable from "mui-datatables";

const stateColumns = ["date", "positive", "negative", "total", "death", "positiveincrease", "deathincrease"];
const countyColumns = ["ds", "all_day_bing_tiles_visited_relative_change", "all_day_ratio_single_tile_users", "fips"]

const options = {
    filterType: 'checkbox',
};

class Chart extends React.Component {
    constructor (props) {
        super(props);
        this.state={
            modalShow:false,
            feature: props.feature,
            data: [],
        }
    }

    loadCountyData(county_fips) {
        console.log('selected county:', county_fips)
        const url = `${window.location.origin}/api/countyData/${county_fips}`
        //const url = `http://localhost:5000/api/countyData/${county_fips}`
        fetch(url)
            .then(response => {
                return response.json()
            }).then(respData => {
            this.setState({data: respData, feature: this.props.feature})
        })
    }

    loadStateData(state_fips) {
        console.log('selected state:', state_fips)
        const url = `${window.location.origin}/api/stateData/${state_fips}`
        //const url = `http://localhost:5000/api/stateData/${state_fips}`
        fetch(url)
            .then(response => {
                return response.json();
            }).then(respData => {
            this.setState({data: respData, feature: this.props.feature})
        });
    }

    convertData = (jsonDataArray) => {
        const tableData = []
        jsonDataArray.forEach(element => {
            const row = []
            const keys = Object.keys(element)
            keys.forEach(key=>{
                row.push(String(element[key]))
            })
            tableData.push(row)
        })
        console.log('tableData:', tableData)
        return tableData
    }

    downloadData = () => {
        const { isState, } = this.props
        const { data, feature, } = this.state
        console.log('isState', isState)
        let saveFileName
        if(isState) {
            saveFileName = `COVID_state_${feature.values_.STATE}.txt`
        } else{
            saveFileName = `MOV_county_${feature.values_.STATE}${feature.values_.COUNTY}.txt`
        }
        const blob = new Blob([JSON.stringify(data), ], { type: 'text/plain;charset=utf-8', })
        saveAs(blob, saveFileName) 
    }

    componentDidMount() {
        const { feature, } = this.props
        console.log('selectedFeature', feature.values_)
        
        if(!feature.values_.LSAD){
            const state_fips = feature.values_.STATE
            this.loadStateData(state_fips)
        }else{
            const county_fips = feature.values_.STATE + feature.values_.COUNTY
            this.loadCountyData(county_fips)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isState) {
            if (prevProps.feature.values_.GEO_ID !== this.props.feature.values_.GEO_ID) {
                const state_fips = this.props.feature.values_.STATE
                this.loadStateData(state_fips)
            }
        } else {
            if (prevProps.feature.values_.GEO_ID !== this.props.feature.values_.GEO_ID) {
                const county_fips = this.props.feature.values_.STATE + this.props.feature.values_.COUNTY
                this.loadCountyData(county_fips)
            }
        }
    }

    render(){
        const { data, } = this.state
        const { isState } = this.props
        console.log('data:', data)
        if (data.length === 0) {
            return null
        } 
        const tableData = this.convertData(data)

        return (
            <div style={{width:'300px',position: 'absolute', top:'70px'}}>
                <Button variant="primary" onClick={() => {this.setState({modalShow:true})}}>
                    Charts
                </Button>
                <Modal
                    show={this.state.modalShow}
                    size="xl"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {this.state.feature.values_.NAME}
                        </Modal.Title>
                        {/* <Button onClick={this.downloadData} style={{'margin-left': '100px'}}>Download</Button> */}
                        <Button onClick={()=>{this.setState({modalShow:false})}}>Close</Button>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Charts</h4>
                        {isState ? 
                            <div>
                                <div>
                                    <BarChart
                                    width={1000}
                                    height={200}
                                    data={data}
                                    margin={{
                                    top: 5, right: 30, left: 20, bottom: 5,
                                    }}
                                    >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="positive" fill="#8884d8" background={{ fill: '#eee' }} />
                                    <Bar dataKey="negative" fill="#82ca9d" />
                                    </BarChart>
                                </div>
                                <div>
                                    <LineChart
                                    width={1000}
                                    height={200}
                                    data={data}
                                    margin={{
                                        top: 5, right: 5, left: 5, bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="positiveincrease" stroke="#8884d8" activeDot={{ r: 5 }} />
                                    <Line type="monotone" dataKey="death" stroke="red" activeDot={{ r: 5 }}/>
                                </LineChart>
                                </div>
                            </div> : 
                        <LineChart
                        width={800}
                        height={300}
                        data={data}
                        margin={{
                            top: 5, right: 5, left: 5, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="ds" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="all_day_bing_tiles_visited_relative_change" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="all_day_ratio_single_tile_users" stroke="#82ca9d" />
                    </LineChart>
                        }
                    <MUIDataTable
                        title={"Employee List"}
                        data={tableData}
                        columns={isState ? stateColumns : countyColumns}
                        options={options}
                    />
                    </Modal.Body>
                    <Modal.Footer>   
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default Chart
