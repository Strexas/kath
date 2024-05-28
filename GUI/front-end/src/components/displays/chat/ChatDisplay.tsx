import InputInstance from './InputInstance';
import React from 'react';
import ChatGroup from './ChatGroup';
import ChatInstance from './ChatInstance';
import { AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import { useApplicationContext } from '../../../contexts';
import { KathLogo } from '../../svgs';
import { useSendRequest } from '../../../hooks';

interface Props {}

export const ChatDisplay: React.FC<Props> = () => {
	const [ChatInstances, setChatInstances] = React.useState<React.ReactNode[]>([]);
	const [isInputDisabled, setIsInputDisabled] = React.useState(false);

	const applicationContext = useApplicationContext();
	const sendRequest = useSendRequest();

	// Array of mock-up texts
	// const mockUpTexts = [
	// 	'Gene frequencies can change over time due to natural selection, mutation, genetic drift, and gene flow.',
	// 	'The BRCA1 gene, linked to breast cancer, is a subject of extensive research.',
	// 	'Genome-wide association studies (GWAS) have identified numerous genetic variants associated with complex diseases.',
	// 	'In the field of genetics, the concept of gene frequency is of paramount importance. It refers to the frequency with which a particular gene variant occurs in a population. This frequency can change over time due to various evolutionary forces such as natural selection, mutation, genetic drift, and gene flow. For instance, if a gene variant confers a survival advantage, its frequency may increase in the population over generations due to natural selection.',
	// 	'One of the most researched genes in human genetics is the BRCA1 gene. This gene produces a protein that helps suppress the growth of tumors. Mutations in the BRCA1 gene can lead to a significantly increased risk for breast and ovarian cancer. Researchers are continually studying this gene to understand its function better and develop effective therapies for individuals carrying BRCA1 mutations.',
	// 	'Genome-wide association studies (GWAS) have revolutionized our understanding of the genetic basis of complex diseases. These studies involve scanning the genomes of thousands of individuals to identify genetic variants associated with a particular disease. For example, GWAS have identified numerous genetic variants associated with diseases such as diabetes, heart disease, and various forms of cancer. However, most of these variants only slightly increase the risk of disease, indicating that these diseases are influenced by a combination of genetic, environmental, and lifestyle factors.',
	// 	'The study of gene frequencies, also known as population genetics, is a fascinating and complex field that seeks to understand how genetic variation occurs within and between populations. This field of study is critical for understanding evolution, genetic diseases, and biodiversity. Gene frequencies can change over time due to several factors, including natural selection, mutation, genetic drift, and gene flow. Natural selection is the process by which certain traits become more or less common in a population based on the survival and reproductive success of individuals with those traits. Mutations, which are changes in the DNA sequence, can introduce new genetic variants into a population. Genetic drift is a random process that can cause gene frequencies to change from one generation to the next, particularly in small populations. Gene flow, which is the transfer of genetic variation from one population to another, can also affect gene frequencies.\n\nOne area of intense research in human genetics is the study of specific genes associated with diseases. For example, the BRCA1 and BRCA2 genes are known to be associated with a higher risk of breast and ovarian cancer. These genes produce proteins that help repair damaged DNA, and when these genes are mutated, the DNA repair process may not function correctly, leading to the development of cancer. Extensive research is being conducted to better understand these genes and develop effective therapies for individuals carrying these mutations.\n\nAnother important area of research is genome-wide association studies (GWAS), which aim to identify genetic variants associated with specific diseases. These studies involve scanning the genomes of thousands of individuals to identify genetic variants that are more common in individuals with a particular disease compared to healthy individuals. GWAS have identified numerous genetic variants associated with a wide range of diseases, including diabetes, heart disease, and various forms of cancer. However, most of these variants only slightly increase the risk of disease, indicating that these diseases are influenced by a combination of genetic, environmental, and lifestyle factors.Despite the significant advances in our understanding of human genetics, there is still much to learn. For example, many of the genetic variants identified by GWAS explain only a small fraction of the heritability of complex diseases, suggesting that there are likely many more genetic variants to be discovered. Furthermore, the role of rare genetic variants, which are not well captured by GWAS, is an area of active research. There is also increasing interest in understanding the role of non-coding regions of the genome, which do not code for proteins but may play important roles in regulating gene expression. As our understanding of human genetics continues to evolve, it is clear that this field of research will continue to provide important insights into human health and disease.\n\nPlease note that this is a simplified explanation and the actual research in genetics is much more complex and nuanced. For accurate and up-to-date information, please refer to scientific literature or consult a genetics professional.',
	// ];
	/////////////////////////

	const handleSubmit = async (content: string) => {
		setIsInputDisabled(true);
		setChatInstances((prevInstances) => [
			...prevInstances,
			<ChatInstance icon={<AccountCircleIcon />} author='User' content={content} />,
		]);

		const responseResult = await sendRequest.mutateAsync(content);
		setIsInputDisabled(false);

		const formatedResponse = responseResult.replace(/(?:\r\n|\r|\n)/g, '<br>');

		setChatInstances((prevInstances) => [
			...prevInstances,
			<ChatInstance icon={<KathLogo />} author={applicationContext.name} content={formatedResponse} />,
		]);

		// Temporary mock up response
		// setTimeout(() => {
		// 	const randomIndex = Math.floor(Math.random() * mockUpTexts.length);
		// 	const randomMockUpText = mockUpTexts[randomIndex];

		// 	setChatInstances((prevInstances) => [
		// 		...prevInstances,
		// 		<ChatInstance icon={<KathLogo />} author={applicationContext.name} content={randomMockUpText} />,
		// 	]);
		// 	setIsInputDisabled(false);
		// }, 1000);
		///////////////////////////////////////
	};

	return (
		<React.Fragment>
			<InputInstance onSubmit={handleSubmit} disabled={isInputDisabled} />
			<ChatGroup instances={ChatInstances} />
		</React.Fragment>
	);
};
