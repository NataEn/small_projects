import React, { Component } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";
import "./App.css";

const { ExportCSVButton } = CSVExport;
const pricesData = [
  { id: "1", fruit: "banana", price: "10" },
  { id: "2", fruit: "apple", price: "20" },
  { id: "3", fruit: "orange", price: "15" }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [...pricesData]
    };
    this.prices = this.prices.bind(this);
  }

  prices = action => {
    if (!action) {
      return this.state.data;
    } else {
      switch (action.actionType) {
        case "addRow":
          let newRow = {};
          newRow.id = this.state.data.length + 1;
          newRow.fruit = " ";
          newRow.price = " ";
          this.setState({ data: [...this.state.data, newRow] });

          return this.state.data;
        case "deleteRow":
          //this delets different rows only
          let new_state = this.state.data.filter(
            row => row.id !== action.row || row.fruit !== action.fruit
          );

          this.setState({ data: [...new_state] });
          return this.state.data;
        default:
          return this.state.data;
      }
    }
  };
  render() {
    return (
      <div className="App">
        <RenderExpenseTable data={this.state.data} prices={this.prices} />
      </div>
    );
  }
}

class RenderExpenseTable extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [...this.props.data] };
  }
  componentWillMount() {
    if (!this.state.data.length) {
      this.setState({ data: [...this.props.prices({ action: "data" })] });
    }
  }

  render() {
    let tableData = this.state.data;
    if (JSON.stringify(this.props.data) === JSON.stringify(tableData)) {
      console.log("in rendered table components the new data is: updated ");
    } else {
      console.log("in rendered table components the new data is: not updated ");
      tableData = this.props.data;
    }
    const columns = [
      {
        dataField: "id",
        text: "Id"
      },
      {
        dataField: "fruit",
        text: "Fruit Name"
      },
      {
        dataField: "price",
        text: "Fruit Price"
      },
      {
        dataField: "databasePkey",
        text: "",
        editable: false,
        formatter: (cell, row) => {
          if (row)
            return (
              <button
                className="btn btn-danger btn-xs border-secondary rounded"
                onClick={() => {
                  this.setState(this.state.data, () => {
                    this.props.prices({
                      actionType: "deleteRow",
                      row: row.id,
                      fruit: row.fruit
                    });
                  });
                }}
              >
                Delete Row
              </button>
            );
          return null;
        }
      }
    ];

    return (
      <div xs={12} className="col form">
        <ToolkitProvider
          keyField="id"
          data={tableData}
          columns={columns}
          exportCSV
        >
          {props => (
            <div>
              <div className="d-flex justify-content-around p-2">
                <ExportCSVButton
                  className="text-light btn bg-success border-secondary rounded"
                  {...props.csvProps}
                >
                  <span>Export CSV</span>
                </ExportCSVButton>

                <button
                  className="btn bg-success text-light rounded"
                  onClick={() =>
                    this.setState(tableData, () => {
                      this.props.prices({ actionType: "addRow" });
                    })
                  }
                >
                  Add Row
                </button>
              </div>
              <BootstrapTable
                {...props.baseProps}
                keyField="id"
                data={tableData}
                columns={columns}
                cellEdit={cellEditFactory({
                  mode: "click",
                  onStartEdit: (row, column, rowIndex, columnIndex) => {},
                  beforeSaveCell: (oldValue, newValue, row, column) => {
                    if (column.dataField === "price") {
                      if (isNaN(Number(newValue))) {
                        alert(
                          "You entered " +
                            newValue +
                            " Please Enter numbers Only!!"
                        );
                      }
                    }
                  },
                  afterSaveCell: (oldValue, newValue, row, column) => {}
                })}
              />
            </div>
          )}
        </ToolkitProvider>
      </div>
    );
  }
}

export default App;
