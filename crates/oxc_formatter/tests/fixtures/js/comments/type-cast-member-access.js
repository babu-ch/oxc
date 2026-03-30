if (attribute.expression.type === 'SequenceExpression') {
	const [get, set] = /** @type {SequenceExpression} */ (context.visit(attribute.expression))
		.expressions;
}
