import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import EditarProduto from '../src/app/EditarProduto/page'

describe('EditarProduto', () => {
 it('renderiza sem erros', () => {
    render(<EditarProduto/>)
 })
})
