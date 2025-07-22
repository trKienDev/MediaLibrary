export class SelectableTable {
      /**
       * Constructor
       * @param {HTMLTableElement} table - Table element.
       * @param {function} onRowSelected - Callback when a row is selected. Receives item.
      */
      constructor(table, onRowSelected) {
            this.table = table;
            this.tbody = table.querySelector('tbody');
            this.onRowSelected = onRowSelected;
      }

      /**
       * Add a selectable row.
       * @param {HTMLTableRowElement} tr - The row to add events.
       * @param {HTMLInputElement} checkbox - Checkbox in row.
       * @param {object} item - Associated data.
      */
      addRow(tr, checkbox, item) {
            tr.addEventListener('click', () => this._selectRow(tr, checkbox, item));
      }

      /**
       * Internal method to handle row selection.
      */
      _selectRow(tr, checkbox, item) {
            // clear all previous selection
            this.tbody.querySelectorAll('input[type="checkbox"').forEach(cb => cb.checked = false);
            this.tbody.querySelectorAll('tr').forEach(row => row.classList.remove('selected'));

            // set selected row
            checkbox.checked = true;
            tr.classList.add('selected');

            if(typeof this.onRowSelected === 'function') {
                  this.onRowSelected(item);
            }
      }
}