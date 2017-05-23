using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using WpfApplication.Models;

namespace WpfApplication
{
    /// <summary>
    /// Interaction logic for Paginate.xaml
    /// </summary>
    public partial class Paginate : Window
    {
        private IUser clsUser;
        private GridViewColumnHeader listViewSortCol = null;
        private SortAdorner listViewSortAdorner = null;
        private SortDescription _sort;
        public Paginate()
        {
            InitializeComponent();

            clsUser = new User();
            CtrPaginate1.OnPageClick += CtrPaginate1_OnPageClick;

            //load default
            _sort = new SortDescription { PropertyName = null };
            LoadPage(1, CtrPaginate1.PageSize, _sort);
        }

        private void CtrPaginate1_OnPageClick(int pageIndex, int pageSize)
        {
            LoadPage(pageIndex, pageSize, _sort);
        }

        private void lvDataColumnHeader_Click(object sender, RoutedEventArgs e)
        {
            GridViewColumnHeader column = (sender as GridViewColumnHeader);
            string sortBy = column.Tag.ToString();
            if (listViewSortCol != null)
            {
                AdornerLayer.GetAdornerLayer(listViewSortCol).Remove(listViewSortAdorner);
                //lvData.Items.SortDescriptions.Clear();
            }

            ListSortDirection newDir = ListSortDirection.Ascending;
            if (listViewSortCol == column && listViewSortAdorner.Direction == newDir)
                newDir = ListSortDirection.Descending;

            listViewSortCol = column;
            listViewSortAdorner = new SortAdorner(listViewSortCol, newDir);
            AdornerLayer.GetAdornerLayer(listViewSortCol).Add(listViewSortAdorner);

            //lvData.Items.SortDescriptions.Add(new SortDescription(sortBy, newDir));
            _sort = new SortDescription(sortBy, newDir);
            LoadPage(1, CtrPaginate1.PageSize, _sort);
        }

        private void LoadPage(int pageIndex, int pageSize, SortDescription sort)
        {
            try
            {
                this.Cursor = Cursors.Wait;
                Thread.Sleep(100);
                var data = clsUser.GetList(pageIndex, pageSize, sort);
                lvData.ItemsSource = data.Users;
                CtrPaginate1.SetPageCurrent(pageIndex, data.RowCount);
                this.Cursor = null;
            }
            catch (Exception e)
            {
                this.Cursor = null;
                MessageBox.Show(e.Message);
            }
        }
    }
}
