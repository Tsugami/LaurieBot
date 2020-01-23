import moment from 'moment'

moment.locale('pt-br')


export function getDate (timestamp: Date) {
	return moment(timestamp).format('LLL');
}