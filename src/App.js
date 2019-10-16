import React from 'react';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            value: '',
            items: [],
            activeItems: 0,
            filter: 'all',
            allCompleted: false,
            editId: -1,
            itemValue: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.addItem = this.addItem.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    addItem(event) {
        event.preventDefault();
        if (this.state.value) {
            let newItem = {
                id: this.state.id,
                text: this.state.value,
                completed: false,
            };

            this.setState(({items}) => {
                return {
                    items: [...items, newItem],
                    value: "",
                    id: this.state.id + 1,
                    activeItems: [...items, newItem].filter(item => !item.completed).length,
                    itemValue: ''
                };
            });
        }
    }

    handleChangeCheckbox(id) {
        const updateItems = [...this.state.items];
        let num = 0;
        updateItems.forEach((item, index) => {
            if (item.id === id) {
                num = index
            }
        });

        updateItems[num].completed = !updateItems[num].completed;

        this.setState({
            items: updateItems,
            activeItems: updateItems.filter(item => !item.completed).length
        });
    }

    deleteItem = id => {
        const updateItems = [...this.state.items];
        const newItems = updateItems.filter(item => item.id !== id);

        this.setState({
            items: newItems,
            activeItems: newItems.filter(item => !item.completed).length
        });
    }

    getfiltered = word => {
        console.log(word)
        switch (word) {
            case 'all':
                this.setState({filter: 'all', editId: -1})
                break;
            case 'active':
                this.setState({filter: 'active', editId: -1})
                break;
            case 'completed':
                this.setState({filter: 'completed', editId: -1})
                break;
        }
    }

    toggleCompleted = () => {
        let isCompleted = this.state.allCompleted;
        const updateItems = [...this.state.items]
        if (this.state.allCompleted) {
            updateItems.map(item => item.completed = true)
        } else {
            updateItems.map(item => item.completed = false)
        }

        this.setState({
            items: updateItems,
            allCompleted: !isCompleted,
            itemValue: ''
        })
    }

    clearCompleted = () => {
        this.setState(({items}) => {
            const activeItems = this.state.items.filter(item => !item.completed);
            return {
                items: activeItems,
                activeItems: activeItems.length,
                itemValue: '',
                filter: 'all'
            }
        })
    }

    editItem = ({id, text}) => {
        console.log(id)
        this.setState({editId: id, itemValue: text})
    }

    onEditItem = (event) => {
        this.setState({itemValue: event.target.value});
    }

    handleEditItem = (event) => {
        event.preventDefault();
        const updateItems = [...this.state.items]
        updateItems.forEach(item => {
            if (item.id === this.state.editId) {
                item.text = this.state.itemValue;
            }
        })
        this.setState({items: updateItems, itemValue: '', editId: -1});
    }

    render() {
        return (
            <React.Fragment>
                <div className="app">
                    <h1 className="app__title">todos</h1>
                    <form onSubmit={this.addItem} className="app__form1">
                        <i onClick={this.toggleCompleted} className={this.state.items.length > 0 && this.state.allCompleted ? "fas fa-chevron-down app__arrow" : "fas fa-chevron-down app__arrow uncompleted"}></i>
                        <input type="text" className="app__field app__field1--pl" value={this.state.value}
                               onChange={this.handleChange} placeholder="What needs to be done?"/>
                    </form>
                    <ul className="items">
                        {
                            this.state.items.map(item =>
                                <li key={item.id} className={
                                    this.state.filter === 'active' && item.completed === false || this.state.filter === 'all' || this.state.filter === 'completed' && item.completed === true
                                        ? "display-block"
                                        : "display-none"
                                }>
                                    <form onSubmit={this.handleEditItem}
                                          className={this.state.itemValue && this.state.editId === item.id ? "display-block" : "display-none"}>
                                        <input type="text" value={this.state.itemValue}
                                               onChange={this.onEditItem} className="app__field p-16"/>
                                    </form>
                                    <div className={this.state.editId !== item.id ? "display-block p-16 item"
                                        : "display-none"}>
                                        <div className="checkbox">
                                            <input type="checkbox" id={"checkbox_" + item.id}  checked={item.completed} onChange={() => this.handleChangeCheckbox(item.id)} />
                                                <label htmlFor={"checkbox_" + item.id}></label>
                                        </div>
                                        <span className={
                                            item.completed
                                                ? "completed item__text"
                                                : "uncompleted item__text"
                                        }
                                              onDoubleClick={() => this.editItem(item)}
                                        >
                                    {item.text}
                                </span>
                                        <button type="button" className="close"
                                                onClick={() => this.deleteItem(item.id)}>x
                                        </button>
                                    </div>

                                </li>
                            )
                        }
                    </ul>
                    <div
                        className={this.state.items.length === 0 ? 'display-none' : 'display-block toolbar'}>{this.state.activeItems} items
                        left
                        <div>
                            <button type="button" className={ this.state.filter !== "all" ? "toolbar__btn" : "toolbar__btn toolbar__btn--active"} onClick={() => this.getfiltered('all')}>all</button>
                            <button type="button" className={ this.state.filter !== "active" ? "toolbar__btn" : "toolbar__btn toolbar__btn--active"} onClick={() => this.getfiltered('active')}>active</button>
                            <button type="button" className={ this.state.filter !== "completed" ? "toolbar__btn" : "toolbar__btn toolbar__btn--active"} onClick={() => this.getfiltered('completed')}>completed</button>
                        </div>
                        <button type="button"
                                className={this.state.items.length !== this.state.activeItems ? 'display-block toolbar__btn toolbar__btn--border' : 'display-none'}
                                onClick={this.clearCompleted}>clear completed
                        </button>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default App;
