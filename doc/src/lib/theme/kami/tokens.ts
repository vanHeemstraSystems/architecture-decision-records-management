export const kamiColors = {
	background: '#0f1419',
	surface: '#16181c',
	border: '#2f3336',
	text: '#e7e9ea',
	textMuted: '#8b98a5',
	person: '#1d9bf0',
	system: '#00ba7c',
	container: '#7856ff',
	component: '#ff7a00',
	decisionAccepted: '#00ba7c',
	decisionProposed: '#1d9bf0',
	decisionDeprecated: '#f4212e',
	decisionSuperseded: '#ff7a00',
	edge: '#71767b',
	edgeDecision: '#ff7a00',
	edgeDecisionDecision: '#c084fc',
	selected: '#ffd400',
	hover: '#ffffff',
	ground: '#1a1d21'
} as const;

export function colorForStyleToken(token: string): string {
	switch (token) {
		case 'person':
			return kamiColors.person;
		case 'system':
			return kamiColors.system;
		case 'container':
			return kamiColors.container;
		case 'component':
			return kamiColors.component;
		case 'decision-accepted':
			return kamiColors.decisionAccepted;
		case 'decision-proposed':
			return kamiColors.decisionProposed;
		case 'decision-deprecated':
		case 'decision-rejected':
			return kamiColors.decisionDeprecated;
		case 'decision-superseded':
			return kamiColors.decisionSuperseded;
		case 'edge-decision':
			return kamiColors.edgeDecision;
		case 'edge-decision-decision':
			return kamiColors.edgeDecisionDecision;
		default:
			if (token.startsWith('edge-')) return kamiColors.edge;
			return kamiColors.container;
	}
}
