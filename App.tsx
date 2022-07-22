import React from "react";
import { createApiClient, Ticket } from "./api";
import "./App.scss";

export type AppState = {
    tickets?: Ticket[];
    search: string;
};

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {
    state: AppState = {
        search: "",
    };

    searchDebounce: any = null;

    async componentDidMount() {
        this.setState({
            tickets: await api.getTickets(),
        });
    }

    hideArr: Ticket[] = [];
    hideTicket = (ticket: Ticket) => {
        this.hideArr.push(ticket);
    };

    renderTickets = (tickets: Ticket[]) => {
        const filteredTickets = tickets.filter((t) =>
            (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase())
        );

        return (
            <ul className="tickets">
                {filteredTickets.map((ticket) => (
                    <li
                        key={ticket.id}
                        className="ticket"
                        style={this.hideArr.includes(ticket) ? { display: "none" } : {}}
                    >
                        <h5 className="title">{ticket.title}</h5>
                        <p>{ticket.content}</p>
                        <button className="hide" onClick={() => this.hideTicket(ticket)}>
                            Hide Ticket
                        </button>
                        <footer>
                            <div className="meta-data">
                                By {ticket.userEmail} | {new Date(ticket.creationTime).toLocaleString()}
                            </div>
                        </footer>
                    </li>
                ))}
            </ul>
        );
    };

    onSearch = async (val: string, newPage?: number) => {
        clearTimeout(this.searchDebounce);

        this.searchDebounce = setTimeout(async () => {
            this.setState({
                search: val,
            });
        }, 300);
    };

    

    render() {
        const { tickets } = this.state;

        return (
            <main>
                <h1>Tickets List</h1>
                <header>
                    <input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)} />
                </header>
                {tickets ? <div className="results">Showing {tickets.length} results</div> : null}
                {tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
            </main>
        );
    }
}

export default App;
