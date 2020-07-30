import React, {Component} from 'react'
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines'
import styles from './style.module.scss'

class ReactApp extends Component {

	constructor(props) {
		super(props);
		this.state = { bp: null, data: [] }
		this._listeners = [];
	}

	addListener(evt, fn) {
		const { capture } = this.props;
		capture.on(evt, fn);
		this._listeners.push(() => capture.off(evt, fn))
	}

	componentDidMount() {
		const { capture } = this.props;
		// Capture the blood pressure data off the mesh
		this.addListener('bp', (value) => {
			this.setState({ bp: value });
		})
		this.addListener('ecg', (point) => {
			this.setState({ data: capture.data() });
		})
	}

	componentWillUnmount() {
		// Remove the listeners
		this._listeners.forEach((l) => l());
		this._listeners = [];
	}

	render() {
		const { data, bp } = this.state;
		const { name } = this.props;
		const fields = ['v'];

		return (
			<div className={styles.App}>
				<h1>{ name }</h1>
				<h2>Patient Information</h2>
				{ data && data.length > 0 && <Sparklines data={data} limit={300} min={300} max={1000} height={120}>
					<SparklinesLine color="#7CBA62" style={{ fill: 'none', strokeWidth: 0.5 }} />
				</Sparklines> }
				<div className={styles.Metrics}>
					<div className={styles.Metric}>
						<label>Blood pressure</label>{ !bp ? 'Connecting...' : bp }
					</div>
				</div>
			</div>
		)
	}
}

export default ReactApp