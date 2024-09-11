"""
Module for testing the `lovd_fill_hg38` function from the `api.data.refactoring` module.
"""
import unittest
import pandas as pd
from api.data.refactoring import lovd_fill_hg38


class TestLOVDFillHg38(unittest.TestCase):
    """
        Unit tests for the `lovd_fill_hg38` function.
    """

    def setUp(self):
        """Set up any initial data used in multiple tests."""
        self.df = pd.DataFrame()

    def test_fill_hg38_with_no_missing_values(self):
        """Test filling hg38 values when no values are missing."""
        self.df = pd.DataFrame({
            'VariantOnGenome/DNA': ['g.64430517C>T', 'g.64430535C>G'],
            'VariantOnGenome/DNA/hg38': ['g.63720621C>T', 'g.63720639C>G']
        })
        lovd_fill_hg38(self.df)
        expected_values = ['6-63720621-C-T', '6-63720639-C-G']
        self.assertIn('hg38_gnomad_format', self.df.columns,
                      "Column 'hg38_gnomad_format' should be added.")
        self.assertListEqual(self.df['hg38_gnomad_format'].tolist(), expected_values)

    def test_fill_hg38_with_missing_values_nan(self):
        """Test filling hg38 values when they are missing (NaN case)."""
        self.df = pd.DataFrame({
            'VariantOnGenome/DNA': ['g.64430518C>T'],
            'VariantOnGenome/DNA/hg38': [pd.NA]
        })
        lovd_fill_hg38(self.df)
        expected_values = ['6-63720622-C-T']
        self.assertIn('hg38_gnomad_format', self.df.columns)
        self.assertListEqual(self.df['hg38_gnomad_format'].tolist(), expected_values)

    def test_fill_hg38_with_missing_values_empty_string(self):
        """Test filling hg38 values when they are missing (empty string case)."""
        self.df = pd.DataFrame({
            'VariantOnGenome/DNA': ['g.64430518C>T'],
            'VariantOnGenome/DNA/hg38': [""]
        })
        lovd_fill_hg38(self.df)
        expected_values = ['6-63720622-C-T']
        self.assertIn('hg38_gnomad_format', self.df.columns)
        self.assertListEqual(self.df['hg38_gnomad_format'].tolist(), expected_values)

    def test_fill_hg38_with_dup_cases(self):
        """Test filling hg38 values when they have 'dup' postfix."""
        self.df = pd.DataFrame({
            'VariantOnGenome/DNA': ['g.64430518dup'],
            'VariantOnGenome/DNA/hg38': [""]
        })
        lovd_fill_hg38(self.df)
        expected_values = ['6-63720622-dup']
        self.assertIn('hg38_gnomad_format', self.df.columns)
        self.assertListEqual(self.df['hg38_gnomad_format'].tolist(), expected_values)

    def test_fill_hg38_with_del_cases(self):
        """Test filling hg38 values when they have 'del' postfix."""
        self.df = pd.DataFrame({
            'VariantOnGenome/DNA': ['g.64430518del'],
            'VariantOnGenome/DNA/hg38': [""]
        })
        lovd_fill_hg38(self.df)
        expected_values = ['6-63720622-del']
        self.assertIn('hg38_gnomad_format', self.df.columns)
        self.assertListEqual(self.df['hg38_gnomad_format'].tolist(), expected_values)

    def test_fill_hg38_with_interval_cases(self):
        """Test filling hg38 values when they have intervals (e.g., 'del' range)."""
        self.df = pd.DataFrame({
            'VariantOnGenome/DNA': ['g.64430540_64430544del'],
            'VariantOnGenome/DNA/hg38': [""]
        })
        lovd_fill_hg38(self.df)
        expected_values = ["?"]
        self.assertIn('hg38_gnomad_format', self.df.columns)
        self.assertListEqual(self.df['hg38_gnomad_format'].tolist(), expected_values)

    def test_fill_hg38_no_variants(self):
        """Test filling hg38 values when there are no variants in the dataframe."""
        self.df = pd.DataFrame(columns=['VariantOnGenome/DNA', 'VariantOnGenome/DNA/hg38'])
        lovd_fill_hg38(self.df)
        self.assertEqual(self.df.shape[0], 0, "Empty dataframe should not add rows.")

    def test_fill_hg38_NA_variants(self):
        """Test filling hg38 values when there are pd. NA variants in the dataframe."""
        self.df = pd.DataFrame({
            'VariantOnGenome/DNA': [pd.NA],
            'VariantOnGenome/DNA/hg38': [pd.NA]
        })
        lovd_fill_hg38(self.df)
        expected_values = ['?']
        self.assertIn('hg38_gnomad_format', self.df.columns,
                      "Column 'hg38_gnomad_format' should be added.")
        self.assertListEqual(self.df['hg38_gnomad_format'].tolist(), expected_values)



if __name__ == '__main__':
    unittest.main()
